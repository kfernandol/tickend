/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

/*Organization table */
IF NOT EXISTS (SELECT 1 FROM Organization WHERE Name = 'Tickend')
BEGIN 
    INSERT INTO Organization(Name, Photo, Address, Email, Phone, CreateDate, Active) VALUES('Tickend', NULL, 'Guatemala', 'edderfernando20@gmail.com' , '59357387', '2024-05-26 20:00:00', 1);
END;

/*Rol table */
IF NOT EXISTS (SELECT 1 FROM Rol WHERE Name = 'Administrator')
BEGIN 
    INSERT INTO Rol(Name, PermissionLevel, OrganizationId, Active) VALUES('Administrator', 1, 1, 1)
END;

/*Users Table */
IF NOT EXISTS (SELECT 1 FROM [User] WHERE Username = 'Administrator')
BEGIN 
    INSERT INTO [User](Username, FirstName, LastName, Password, Salt,  Email, Active) 
    VALUES('Administrator', 'Edder','Barillas', 'jFQqrIMWUMGJEa8SWmYp5bsbhd/67y1JA5yRmXEqd1w=', 'kiFFKjUclHd03kvLDeRzLGa6XxJWYY+c8vzc6MdBfd4=', 'edderfernando20@gmail.com', 1)/*Password default 123456*/
END;

/* RolXUser Table */
IF NOT EXISTS (SELECT 1 FROM RolXUser WHERE UserId = 1)
BEGIN 
    INSERT INTO RolXUser(RolId, UserId) VALUES(1,1)
END;


/* OrganizationXUser Table */
IF NOT EXISTS (SELECT 1 FROM OrganizationsXUser WHERE UserId = 1)
BEGIN 
    INSERT INTO OrganizationsXUser(OrganizationId, UserId) VALUES(1, 1);
END;


/* Default inserts in Menu table */
IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Security')
BEGIN 
INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId,  Active) 
    VALUES('Security', 'security', '#', NULL, 1, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Users')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('Users', 'pi pi-users', '/Users', 1, 1, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Roles')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('Roles', 'pi pi-id-card', '/Roles', 1, 2, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Menus')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('Menus', 'pi pi-th-large', '/Menus', 1, 3, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'AuditLogs')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('AuditLogs', 'pi pi-book', '/Audit', 1, 4, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'ProjectsP')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('ProjectsP', '', '#', NULL, 2, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Projects')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('Projects', 'pi pi-copy', '/Projects', 6, 1, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'TicketsP')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('TicketsP', '', '#', NULL, 3, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Tickets')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('Tickets', 'pi pi-ticket', '/Tickets', 8, 1, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'TicketTypes')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('TicketTypes', 'pi pi-tags', '/Ticket/Types', 8, 2, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'TicketStatus')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('TicketStatus', 'pi pi-sliders-h', '/Ticket/Status', 8, 3, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'TicketPriority')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('TicketPriority', 'pi pi-sort-amount-up', '/Ticket/Priorities', 8, 4, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'StadisticsP')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('StadisticsP', '', '#', NULL, 4, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Stadistics')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, OrganizationId, Active) 
    VALUES('Stadistics', '', '/Stadistics', 13, 1, 1, 1, 1)
END;

/* Default insert in MenuXRol */
IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 1)
BEGIN 
    /* Security Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(1,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 2)
BEGIN 
    /* Users Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(2,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 3)
BEGIN 
    /* Rol Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(3,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 4)
BEGIN 
    /* Menus Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(4,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 5)
BEGIN 
    /* Audit Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(5,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 6)
BEGIN 
    /* Projects Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(6,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 7)
BEGIN 
    /* Projects Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(7,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 8)
BEGIN 
    /* Tickets Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(8,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 9)
BEGIN 
    /* Tickets Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(9,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 10)
BEGIN 
    /* Tickets Type Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(10,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 11)
BEGIN 
    /* Tickets Status Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(11,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 12)
BEGIN 
    /* Tickets Priorities Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(12,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 13)
BEGIN 
    /* Stadistics Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(13,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 12)
BEGIN 
    /* Stadistics Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(14,1)
END;