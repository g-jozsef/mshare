﻿using System;
using System.Collections.Generic;
using System.Text;

namespace EmailTemplates.ViewModels
{
    /// <summary>ViewModel for a confirmation type email</summary>
    public class InformationViewModel
    {
        /// <summary>Title of the page</summary>
        public string Title { get; set; }
        /// <summary>PreHeader for this email</summary>
        public string PreHeader { get; set; }
        /// <summary>Hero at the top of this email</summary>
        public string Hero { get; set; }
        /// <summary>Disclaimers in the footer</summary>
        public string EmailDisclaimer { get; set; }
        /// <summary>Greeting for the reader</summary>
        public string Greeting { get; set; }
        /// <summary>First paragraph</summary>
        public string Intro { get; set; }
        /// <summary>Greeting at the end</summary>
        public string Cheers { get; set; }
        /// <summary>Team name</summary>
        public string MShareTeam { get; set; }
        /// <summary>Base URL for the website for static resources</summary>
        public string SiteBaseUrl { get; set; }
    }
}
