CREATE TABLE [dbo].[UserRestorePassword]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[UserId] INT NOT NULL FOREIGN KEY REFERENCES [User](Id),
	[Hash] varchar(150) NOT NULL,
	[CreateDate] datetime NOT NULL,
	[ExpirationDate] datetime NOT NULL,
	[Used] bit NOT NULL
)
