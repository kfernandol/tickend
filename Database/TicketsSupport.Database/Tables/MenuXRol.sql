﻿CREATE TABLE [dbo].[MenuXRol]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[MenuId] int FOREIGN KEY REFERENCES [dbo].[Menu](Id) NOT NULL,
	[RoleId] int FOREIGN KEY REFERENCES [dbo].[Rol](Id) NOT NULL
) 
