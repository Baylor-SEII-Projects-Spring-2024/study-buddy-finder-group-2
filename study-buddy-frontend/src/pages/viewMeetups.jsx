import React, { useEffect, useState } from 'react';

function MeetupsPage() {
    const [meetups, setMeetups] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/viewMeetups')
            .then(response => response.json())
            .then(data => setMeetups(data))
            .catch(error => console.error('Error fetching meetups:', error));
    }, [])

    return (
        <div>
            <h1>Available Meetups</h1>
            <ul>
                {meetups.map((meetup, index) => (
                    <li key={index}>{meetup}</li>
                ))}
            </ul>
        </div>
    );
}

export default MeetupsPage;
