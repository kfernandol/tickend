CREATE TABLE [dbo].[Organization]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] VARCHAR(150) NOT NULL,
	[Photo] varchar(MAX) NULL,
	[Address] VARCHAR(255) NULL,
    [Email] VARCHAR(255) NULL,
    [Phone] VARCHAR(50) NULL,
	[CreateDate] datetime NOT NULL,
	[Active] BIT NOT NULL
)
