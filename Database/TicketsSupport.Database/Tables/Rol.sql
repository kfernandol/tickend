CREATE TABLE [dbo].[Rol]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(150) NOT NULL,
	[Description] varchar(1000) NULL,
	[PermissionLevel] int NOT NULL,
	[OrganizationId] INT FOREIGN KEY REFERENCES [Organization](Id) NOT NULL,
	[Active] bit NOT NULL
)
