import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Runner() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [runners, setRunners] = useState([]);

    const handleClick = (e) => {
        e.preventDefault();
        const runner = { name, address };
        console.log(runner);

        fetch("http://localhost:8080/api/v1/runner/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(runner),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add runner!");
                }
                console.log("New runner added successfully!");
            })
            .catch((error) => {
                console.error("There was an error adding the runner:", error);
            });
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/runner/get")
            .then(res => res.json())
            .then((result) => {
                setRunners(result);  // Setează lista de runners
            })
            .catch((error) => {
                console.error("Error fetching runners:", error);
            });  // Închidem corect parantezele pentru then() și fetch()
    }, []);

    return (
        <div> {/* Wrapper principal pentru componentă */}
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="runner-name"
                    label="Runner name"
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    id="runner-address"
                    label="Runner address"
                    variant="standard"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Button type="button" variant="contained" onClick={handleClick}>
                    Submit
                </Button>
            </Box>

            {/* Afișare listă runneri */}
            <h2>Runners List:</h2>
            <ul>
                {runners.map((runner, index) => (
                    <li key={index}>
                        <strong>Name:</strong> {runner.name} | <strong>Address:</strong> {runner.address}
                    </li>
                ))}  
            </ul>  
        </div>
    );
}
