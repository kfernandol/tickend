CREATE TABLE [dbo].[User]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Photo] VARBINARY(MAX) NULL,
	[FirstName] VARCHAR(150) NULL,
	[LastName] Varchar(150) NULL,
	[Username] VARCHAR(50) NOT NULL,
	[Email] varchar(200) NULL,
	[Password] varchar(100) NOT NULL,
	[Phone] varchar(16) NULL,
	[Direction] varchar(100) NULL,
	[Salt] varchar(100) NOT NULL,
	[RefreshToken] varchar(100) NULL,
	[RefreshTokenExpirationTime] datetime NULL,
	[Rol] int FOREIGN KEY REFERENCES Rol(Id),
	[Active] bit NOT NULL,
)
