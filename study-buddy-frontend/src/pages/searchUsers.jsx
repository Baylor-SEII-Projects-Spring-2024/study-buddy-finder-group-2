import React from 'react';
import Head from "next/head";
import axios from "axios";

import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import Link from "next/link";
function SearchUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    if (searchQuery.trim() !== '') {
        axios.fetch(`http://34.16.169.60:8080/api/searchUsers`)
        //axios.fetch(`http://localhost:8080/api/searchUsers`)
            .then(response => {
              
              setSearchResults(response.data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    } else {
        setSearchResults([]);
    }
}, [searchQuery]);
const handleSearchInputChange = (event) => {
  setSearchQuery(event.target.value);
};
const handleUserSelect = (user) => {
  setSelectedUser(user);
};
const handleAddFriend = () => {
  
  console.log('Adding', selectedUser.name, 'as a friend...');

};
return (
  <div>
  <h1>Search Users</h1>
  <input
    type="text"
    value={searchQuery}
    onChange={handleSearchInputChange}
    placeholder="Search users..."
  />
  <ul>
    {searchResults.map(user => (
      <li key={user.id} onClick={() => handleUserSelect(user)}>
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Username:</strong> {user.username}
        </div>
      </li>
    ))}
  </ul>
  {selectedUser && (
    <div>
      <h2>Selected User</h2>
      <div>
        <strong>Name:</strong> {selectedUser.name}
      </div>
      <div>
        <strong>Username:</strong> {selectedUser.username}
      </div>
      <button onClick={handleAddFriend}>Add Friend</button>
    </div>
  )}
</div>
  );
}

export default SearchUsersPage;
