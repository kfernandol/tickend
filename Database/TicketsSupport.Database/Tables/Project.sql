CREATE TABLE [dbo].[Project]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(100) NOT NULL,
	[Description] varchar(500) NOT NULL,
	[Photo] varchar(MAX) NULL,
	[ExpirationSupportDate] date NULL,
	[OrganizationId] INT FOREIGN KEY REFERENCES [Organization](Id) NOT NULL,
	[Active] bit NOT NULL,
)
