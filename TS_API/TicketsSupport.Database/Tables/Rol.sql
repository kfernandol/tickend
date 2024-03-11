CREATE TABLE [dbo].[Rol]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(150) NOT NULL,
	[PermissionLevelId] int FOREIGN KEY REFERENCES Rol_PermissionsLevel(Id),
	[Active] bit NOT NULL
)
