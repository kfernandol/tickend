using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Text.RegularExpressions;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Interceptors
{
    public sealed class AuditLogInterceptor : SaveChangesInterceptor
    {
        private readonly TS_DatabaseContext _context;
        public AuditLogInterceptor(TS_DatabaseContext context)
        {
            _context = context;
        }

        /*
        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            var context = eventData.Context;
            context.ChangeTracker.DetectChanges();

            AuditLog(context, eventData.Context.ChangeTracker.Entries().ToList(), 1, InterceptorActions.Modified);
            return base.SavingChanges(eventData, result);
        }
        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            var context = eventData.Context;
            context.ChangeTracker.DetectChanges();

            AuditLog(context, eventData.Context.ChangeTracker.Entries().ToList(), 1, InterceptorActions.Modified);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }*/

        public Task<int> SaveChangesAsync(int userId, int? organizationId, InterceptorActions action, CancellationToken cancellationToken = default)
        {
            var entries = _context.ChangeTracker.Entries().ToList();
            AuditLog(_context, entries, userId, organizationId, action);
            return _context.SaveChangesAsync(cancellationToken);
        }

        private void AuditLog(DbContext context, List<EntityEntry> entries, int userId, int? organizationId, InterceptorActions action)
        {
            foreach (var entry in entries)
            {

                if (entry.State == EntityState.Added || entry.State == EntityState.Modified || entry.State == EntityState.Deleted)
                {
                    var PrimaryId = entry.Entity.GetType().GetProperty("Id")?.GetValue(entry.Entity, null);

                    var auditLog = new AuditLog
                    {
                        UserId = userId,
                        Action = action,
                        Date = DateTime.Now,
                        Table = entry.Entity.GetType().Name,
                        PrimaryId = (PrimaryId is int id && id > 0) ? id.ToString() : string.Empty,
                        OrganizationId = organizationId
                    };


                    var originalValues = entry.GetDatabaseValues();
                    var changesCount = 0;
                    foreach (var property in entry.Properties)
                    {
                        var columnName = property.Metadata.Name;
                        var oldValueObj = entry.State == EntityState.Modified ? originalValues?.GetValue<object>(columnName) ?? string.Empty : null;
                        var newValue = entry.State == EntityState.Added || entry.State == EntityState.Modified ? property.CurrentValue?.ToString() : null;
                        var typeValue = GetTypeValue(property.Metadata);

                        var AuditLogDetail = new AuditLogDetail
                        {
                            ColumnName = columnName,
                            OldValue = oldValueObj?.ToString(),
                            NewValue = newValue ?? string.Empty,
                            TypeValue = typeValue
                        };


                        if (AuditLogDetail.OldValue != AuditLogDetail.NewValue)
                        {
                            auditLog.AuditLogDetails.Add(AuditLogDetail);
                            changesCount++;
                        }
                    }

                    if (changesCount > 0 && auditLog.AuditLogDetails.Count > 0)
                        _context.AuditLogs.Add(auditLog);
                }
            }

            _context.SaveChanges();
        }

        private TypeValue GetTypeValue(IPropertyBase propertyMetadata)
        {
            switch (propertyMetadata.PropertyInfo?.PropertyType.Name)
            {
                case "Int32":
                case "Int64":
                    return TypeValue.Int;
                case "Single":
                    return TypeValue.Float;
                case "Double":
                    return TypeValue.Double;
                case "String":
                    return TypeValue.String;
                case "Char":
                    return TypeValue.Char;
                case "Boolean":
                    return TypeValue.Boolean;
                case "PermissionLevel":
                case "Byte[]":
                case "Byte":
                    return TypeValue.Byte;
                case "Nullable`1":
                    return TypeValue.Nullable;
                case "DateTime":
                    return TypeValue.DateTime;
                case "DateOnly":
                    return TypeValue.DateOnly;
                case "TimeOnly":
                    return TypeValue.TimeOnly;
                case "TimeSpan":
                    return TypeValue.TimeSpan;
                default:
                    throw new InvalidOperationException($"Tipo de propiedad no compatible: {propertyMetadata?.PropertyInfo?.PropertyType.Name}");
            }
        }
    }
}
