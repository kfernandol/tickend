CREATE TABLE [dbo].[TicketPriority]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(100) NOT NULL,
	[Color] varchar(7) NOT NULL,
	[OrganizationId] INT FOREIGN KEY REFERENCES [Organization](Id) NOT NULL,
	[Active] bit NOT NULL
)
