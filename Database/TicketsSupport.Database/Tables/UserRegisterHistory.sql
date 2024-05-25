CREATE TABLE [dbo].[UserRegisterHistory]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[UserId] INT FOREIGN KEY REFERENCES [User](Id) NOT NULL,
	[HashConfirmation] varchar(150) NULL,
	[IP] varchar(16) NOT NULL,
	[RegisterDate] DATETIME NOT NULL,
	[ConfirmationDate] DATETIME NULL,
	[Confirmed] BIT NOT NULL
)
