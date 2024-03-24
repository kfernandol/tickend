CREATE TABLE [dbo].[ProjectXTicketPriority]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[ProjectId] INT NOT NULL FOREIGN KEY REFERENCES [Project](Id),
	[TicketPriorityId] INT NOT NULL FOREIGN KEY REFERENCES [TicketPriority](Id)
)
