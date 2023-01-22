**INoteApp**

A single-page INotes application implemented using the 
MERN stack (MongoDB, Express.JS, ReactJS, and Node.js).

The program is composed of 5 react components, they are: 
    INoteApp, Login, MainPage, RightBar, LeftBar, TopBar

INoteApp: controlling the login state, return Login or MainPage
    Login: page for login, will change the state of INoteApp after login
    MainPage: page after login, show the main content of the app, return 3 components: RightBar, LeftBar, TopBar
        TopBar: contains the user's icon, name and the log out button
        LeftBar: contains the search bar and note list
        RightBar: contains the title and content of the note, and the icon for adding note according to different states.


Some key states used:
    edit: controls the editing mode.
    note & notes: the note displayed in the RightBar and the notes list in the LeftBar.
    selected: controls the selected note.
    searchText, title, content: handle the change of searchText, title and content

States and their change handler methods are set and passed as props throughout the MainPage, RightBar, LeftBar, TopBar components for rerendering and synchronization

The backend server does the same as the assignment description