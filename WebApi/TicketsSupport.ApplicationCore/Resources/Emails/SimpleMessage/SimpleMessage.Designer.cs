﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TicketsSupport.ApplicationCore.Resources.Emails.SimpleMessage {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class SimpleMessage {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal SimpleMessage() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("TicketsSupport.ApplicationCore.Resources.Emails.SimpleMessage.SimpleMessage", typeof(SimpleMessage).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Password was successfully changed.
        /// </summary>
        internal static string MessagePasswordChanged {
            get {
                return ResourceManager.GetString("MessagePasswordChanged", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Your Ticket No. {0} has been assigned a priority: {1}..
        /// </summary>
        internal static string MessageTicketPriorityChange {
            get {
                return ResourceManager.GetString("MessageTicketPriorityChange", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Your Ticket No. {0} has changed status: {1} -&gt; {2}..
        /// </summary>
        internal static string MessageTicketStatusChange {
            get {
                return ResourceManager.GetString("MessageTicketStatusChange", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Hi.
        /// </summary>
        internal static string Saludation {
            get {
                return ResourceManager.GetString("Saludation", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The password was changed.
        /// </summary>
        internal static string SubjectPasswordChanged {
            get {
                return ResourceManager.GetString("SubjectPasswordChanged", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Update priority of Ticket No. {0}.
        /// </summary>
        internal static string SubjectTicketPriorityChange {
            get {
                return ResourceManager.GetString("SubjectTicketPriorityChange", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Status update of ticket No. {0}.
        /// </summary>
        internal static string SubjectTicketStatusChange {
            get {
                return ResourceManager.GetString("SubjectTicketStatusChange", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to If you did not initiate this request, please contact us immediately at.
        /// </summary>
        internal static string WarningMessage {
            get {
                return ResourceManager.GetString("WarningMessage", resourceCulture);
            }
        }
    }
}
