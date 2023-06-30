# SOCKETS

This File contains all the events and the object that needs to be passed for the event and a brief description of what the event does

**The `sessionId` attribute must be passed in every event which used to identify the socket server room and also pass the `Authorization` Header for authorization check**

**Both the users must join the session in order to move the session ahead**

## Data Transfer Object

### Event Object

The client will emit a specific event based on the events described by the server which may consist of the `sessionId` and other attributes defined by the server.The client can have an `event` object attribute for any event  which will be forwarded to the other client which can be used for the other client side to use that data to manipulate the screens and user experience. For a not-backend specific event the client can emit `forward` event which will directly forward the same event object to the other connected user.
### Server Object

The server object is emitted by the server which contains the information about the userId and userRoles which can be used to identify the roles and show the respective view. Currently the object sent on specfic events only but can be sent on any event using the `sendServerInfo` function call.
## Events
### `Join Session`

This event will make the user join a socker server room with `room ID` : `sessionId` which will be a unique identifier.

**Event name** - `join`

**Event Object**
```json
{
	"sessionId":"asdc654edcvbju8ijb",
}
```

In the execution a `join` will be emitted by the server with the information regarding the users like the name, role ,id etc.

### Change State

The session state - meaning the page or action the driver performed in the session which has to be stored in the backend to identify on resuming the session.

**Event ID** - `state-change`

**Event Object**
```json
{
	"sessionId":"asdc654edcvbju8ijb",
	"state":"page-action-name"
}
```
In the execution the state will be stored in the session details in the database and `state-change` event will be emitted by the server.

### Notepad Typing
The notepad that is used by the users to take notes  during the session .

**Event name** - `notepad-type`

**Event Object**
```json
{
	"sessionId":"asdc654edcvbju8ijb",
	"notes":"This is the text in the notepad for n",
	"event":""
}
```
The notes attribute will have all the text which is in the notepad and here the `event` attribute can be used to manipulate the screens for the client.

### Role Switch 
This event will be performed when the users want to switch the role from Driver to Navigator or vice versa.

**Event name** - `role-switch`

**Event Object**
```json
{
	"sessionId":"asdc654edcvbju8ijb",
	"server":"object"
}
```

In the execution, the `role-switch` event will be emitted with the server object which contains the information.

