CREATE TABLE [dbo].[Menu]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] varchar(100) NOT NULL,
	[Url] varchar(300) NOT NULL,
	[Icon] varchar(300) NULL,
	[Position] int NOT NULL,
	[ParentId] int NULL,
	[Show] bit NOT NULL,
	[OrganizationId] INT FOREIGN KEY REFERENCES [Organization](Id) NOT NULL,
	[Active] bit NOT NULL
)
