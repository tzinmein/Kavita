﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs.Update;
using API.Services.Tasks;

namespace API.Interfaces.Services
{
    public interface IVersionUpdaterService
    {
        Task<UpdateNotificationDto> CheckForUpdate();
        Task PushUpdate(UpdateNotificationDto update);
        Task<IEnumerable<UpdateNotificationDto>> GetAllReleases();
    }
}
