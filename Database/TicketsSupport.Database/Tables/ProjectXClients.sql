﻿CREATE TABLE [dbo].[ProjectXClients]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[ProjectId] INT NOT NULL FOREIGN KEY REFERENCES [Project](Id),
	[ClientId] INT NOT NULL FOREIGN KEY REFERENCES [User](Id)
)