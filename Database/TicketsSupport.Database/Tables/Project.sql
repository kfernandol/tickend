CREATE TABLE [dbo].[Project]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(100) NOT NULL,
	[Description] varchar(500) NOT NULL,
	[Photo] VARBINARY(MAX) NULL,
	[ExpirationSupportDate] date NULL,
	[Active] bit NOT NULL,
)
