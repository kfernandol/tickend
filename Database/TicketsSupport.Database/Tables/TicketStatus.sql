CREATE TABLE [dbo].[TicketStatus]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(100) NOT NULL,
	[Color] varchar(7) NOT NULL,
	[Active] bit
)
