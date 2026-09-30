# Collaborative Network File System (Project 4)

**Course:** Computer Networks — Mini Project  
**Name:** Anuj Gautam<br>
**Roll No.:** 24051539<br>
**Project Selection:** Project 4 — Collaborative Network File System  
**Mode:** Individual Project  

---

##  Project Overview

This project is a server-backed collaborative file system that enables multiple clients to view, open, and edit shared files concurrently in real time. Built to explore the underlying mechanics of real-time state synchronization, the application uses a client-server architecture where the server acts as the central coordinator for state management and concurrency control.

---

##  Motivation & Objectives

I chose **Project 4** out of an interest in understanding how real-time collaborative platforms (like Google Docs or VS Code Live Share) work under the hood on the backend. The primary goal is to learn and implement:
- Robust client-server network socket management.
- Real-time data synchronization across multiple concurrent connections.
- Server-side concurrency control and conflict resolution strategies to prevent data corruption.
- Network resilience handling client disconnects and reconnects gracefully.

---

##  Planned Features

### Client / Frontend
- **Shared File Dashboard:** A user interface allowing clients to browse available files stored on the server.
- **Real-Time Text Editor:** Interactive view enabling users to open, view, and edit shared document contents live.
- **Optimistic Local Updates:** Immediate feedback on user input while broadcasting operation updates asynchronously to the server.

### Backend / Server
- **Centralized Concurrency Control:** Server-side engine responsible for managing operational synchronization and resolving concurrent edit conflicts across clients.
- **Client Session Management:** Real-time connection handling via WebSockets/sockets to track active editors and document states.
- **State Recovery & Reconnection:** Logic to restore disconnected clients to the latest consistent file snapshot upon reconnection.
- **User Authentication *(Optional / Stretch Goal)*:** Simple authentication mechanism to manage file access and user permissions.

---

##  Declaration of AI Usage

In accordance with course guidelines, the use of AI tools for this project is declared beforehand and will be strictly restricted to the following scopes:

1. **Documentation:** Formatting, organizing, and polishing code comments, API specifications, and project write-ups (`README.md`).
2. **Debugging:** Assisting in diagnosing specific runtime stack traces, memory leaks, or socket lifecycle bugs.
3. **Conceptual Learning:** Exploring and understanding theoretical concepts surrounding distributed concurrency models (e.g., locking strategies, Operational Transformation, and CRDTs).

*All core application logic, system design choices, and implementation will be independently developed.*

---

##  Project Structure & Setup

*(To be updated as development progresses)*

```text
.
├── client/          # Frontend UI application
├── server/          # Central server & concurrency engine
├── docs/            # Architecture & design documents
└── README.md        # Project overview & guidelines
```

---
