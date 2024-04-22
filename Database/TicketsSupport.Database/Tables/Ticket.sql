﻿CREATE TABLE [dbo].[Ticket]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Title] varchar(150) NOT NULL,
	[Description] varchar(MAX) NOT NULL,
	[ProjectId] INT NOT NULL FOREIGN KEY REFERENCES Project(Id),
	[TicketTypeId] INT NOT NULL FOREIGN KEY REFERENCES TicketType(Id),
	[TicketPriorityId] INT NULL FOREIGN KEY REFERENCES TicketPriority(Id),
	[TicketStatusId] INT NULL FOREIGN KEY REFERENCES TicketStatus(Id),
	[IsClosed] BIT NOT NULL,
	[DateCreated] datetime NOT NULL,
	[DateUpdated] datetime NULL,
	[CreateBy] INT NOT NULL FOREIGN KEY REFERENCES [User](Id),
	[Active] bit NOT NULL
)