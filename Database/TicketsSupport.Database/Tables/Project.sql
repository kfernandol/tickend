CREATE TABLE [dbo].[Project]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(100) NOT NULL,
	[Photo] VARBINARY(MAX) NULL,
	[Active] bit NOT NULL,
)
