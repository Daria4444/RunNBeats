package com.project.RunNBeats.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.RunNBeats.dto.RunAchievementDto;
import com.project.RunNBeats.dto.RunDto;
import com.project.RunNBeats.errors.ResourceNotFoundException;
import com.project.RunNBeats.model.Achievement;
import com.project.RunNBeats.model.Run;
import com.project.RunNBeats.model.Runner;
import com.project.RunNBeats.repository.AchievementRepository;
import com.project.RunNBeats.repository.RunRepository;
import com.project.RunNBeats.repository.RunnerRepository;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Base64;
import java.util.List;

@Service
public class RunServiceImpl {
    private final RunRepository runRepository;
    private final RunnerRepository runnerRepository;
    private final AchievementService achievementService;

    @Autowired
    public RunServiceImpl(RunRepository runRepository, RunnerRepository runnerRepository, AchievementService achievementService) {
        this.runRepository = runRepository;
        this.runnerRepository = runnerRepository;
        this.achievementService = achievementService;
    }
    public List<Run> getRuns (){ return runRepository.findAll();}

    public Run getRunById(int runId) {
        return runRepository.findById(runId)
                .orElseThrow(() -> new RuntimeException("Run not found with id: " + runId));

    }

    public Page<RunDto> findByRunner_RunnerId(int runnerId, Pageable pageable) {
        Page<Run> runs = runRepository.findByRunner_RunnerId(runnerId, pageable);
        return runs.map(this::convertToDto);
    }

    public ResponseEntity<byte[]> getRunMapImage(int id) {
            Run run = runRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

            byte[] imageData = run.getMapImage();
            if (imageData == null || imageData.length == 0) {
                throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No map image");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
    }

    private RunDto convertToDto(Run run) {
        RunDto dto = new RunDto();
        dto.setRunnerId(run.getRunner().getRunnerId());
        dto.setDistance(run.getDistance());
        dto.setDuration(run.getDuration().intValue());
        dto.setAverageSpeed(run.getAverageSpeed());
        dto.setPace(run.getPace());
        dto.setTimestamp(run.getTimestamp().toString());
        dto.setMapImageUrl("/api/runs/" + run.getRunId() + "/map");

        // deserializează traseul JSON înapoi în List<List<Double>> dacă vrei
//        try {
//            ObjectMapper mapper = new ObjectMapper();
//            dto.setPath(mapper.readValue(run.getPath(), new TypeReference<List<List<Double>>>() {}));
//        } catch (Exception e) {
//            dto.setPath(null);
//        }
        return dto;
    }


    public RunAchievementDto addRun(RunDto runDto) {
        Run run = new Run();
        run.setDistance(runDto.getDistance());
        run.setDuration(runDto.getDuration());
        run.setAverageSpeed(runDto.getAverageSpeed());
        run.setPace(runDto.getPace());

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String pathJson = objectMapper.writeValueAsString(runDto.getPath());
            run.setPath(pathJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Eroare la serializarea traseului", e);
        }

        if (runDto.getMapImage() != null && runDto.getMapImage().startsWith("data:image")) {
            try {
                String base64Image = runDto.getMapImage().split(",")[1];
                byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                run.setMapImage(imageBytes);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Eroare la decodarea imaginii base64", e);
            }
        }

        run.setTimestamp(Instant.parse(runDto.getTimestamp()));

        Runner runner = runnerRepository.findById(runDto.getRunnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Runner not found"));
        run.setRunner(runner);
        runRepository.save(run);

        List<Achievement> newlyUnlocked = achievementService.evaluateAchievements(runner, run);
        RunAchievementDto runAchievementDto = new RunAchievementDto();
        runAchievementDto.setRun(run);
        runAchievementDto.setNewlyUnlockedAchievements(newlyUnlocked);

        return runAchievementDto;
    }

    public Run updateRun(int runId, Run run) {
        Run existingRun = runRepository.findById(runId)
                .orElseThrow(() -> new ResourceNotFoundException("Run not found with id: " + runId));

        //int runnerId = run.getRunner().getRunnerId();

        //Runner runner = runnerRepository.findById(runnerId)
               // .orElseThrow(() -> new ResourceNotFoundException("Runner not found with id: " + runnerId));

       /* existingRun.setDistance(run.getDistance());
        existingRun.setRunTime(run.getRunTime());
        existingRun.setAveragePace(run.getAveragePace());
        existingRun.setRunLocation(run.getRunLocation());*/

        return runRepository.save(existingRun);
    }

    public void deleteRun(int runId) {
        if (!runRepository.existsById(runId)) {
            throw new ResourceNotFoundException("Run not found with id: " + runId);
        }
        runRepository.deleteById(runId);
    }
}
