import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = null => încărcare sau neautentificat
  const [loading, setLoading] = useState(true);
  const runnerId = localStorage.getItem('runnerId');

  useEffect(() => {
    // Simulăm fetch la mount (ex: când intri în app)
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/runner/get/${runnerId}?`, {
      headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, [runnerId]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook custom pentru acces rapid
export const useUser = () => useContext(UserContext);
