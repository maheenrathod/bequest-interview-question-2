import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>('');
  const [hash, setHash] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();
    setData(data);
    setHash(hash);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  /**
   * generates a new hash value on the client 
   * side to be compared during verification 
   */
  const generateHash = async (data: string) => {
    // converts given data (string) into byte array
    const dataEncode = new TextEncoder();
    const newData = dataEncode.encode(data);
    // using byte array, the new hash is computed
    const newHash = await crypto.subtle.digest('SHA-256', newData);
    //converted from byte array into hexadecimal string
    return Array.from(new Uint8Array(newHash)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  /**
   * verifies the integrity of data by way of comparing
   * newly computed hash with server-side hash value
   */
  const verifyData = async () => {
    const computeHash = await generateHash(data);
    // if newly computed hash is similar to hash stored on the server, a positive alert is sent.
    if (computeHash === hash) {
      alert('The data is secure');
    } else {
      alert('The data has been tampered with');
    }
  };

  /**
   * a recovery function is created as a form of a 
   * versioning system for backed up data.
   * in case of tampering, old data before the security
   * breach may be recovered
   */
  const recoverData = async () => {
    const response = await fetch(`${API_URL}/recover`, { method: "POST" });
    const { data } = await response.json();
    setData(data);
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
