CREATE TABLE [dbo].[Rol]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(150) NOT NULL,
	[PermissionLevel] int NOT NULL,
	[Active] bit NOT NULL
)
