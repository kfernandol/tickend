﻿CREATE TABLE [dbo].[TicketType]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(100) NOT NULL,
	[Icon] varchar(50) NOT NULL,
	[IconColor] varchar(7) NOT NULL,
	[OrganizationId] INT FOREIGN KEY REFERENCES [Organization](Id) NOT NULL,
	[Active] bit NOT NULL,
)
