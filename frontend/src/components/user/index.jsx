import React, { useEffect, useState } from "react";
import checkAuth from "../../service/auth";
import Loading from "./loading";
import SignedIn from "./signedIn";
import SignedOut from "./signedOut";
import "./style.css";

function UserComponent() {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function auth() {
      const authResult = await checkAuth();
      setSigned(authResult.signedIn);
      setLoading(false);
    }
    auth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={window.location.pathname === "/" ? "User main" : "User closed"}>
      {signed ? <SignedIn /> : <SignedOut />}
    </div>
  );
}

export default UserComponent;