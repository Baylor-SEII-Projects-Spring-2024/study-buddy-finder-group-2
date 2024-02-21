import React, {useEffect, useState} from 'react';

function StudentLandingPage() {
    var [username, setUsername] = useState(null);
    useEffect(() => {
        console.log(window.location.search);
        const params = new URLSearchParams(window.location.search),
        user = params.get("userid");
        setUsername(user);
    }, []);
    console.log("hi " + username);

  return (
    <div>
      <h1>Hello Student {username}!</h1>
    </div>
  );
}

export default StudentLandingPage;
