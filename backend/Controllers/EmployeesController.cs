﻿using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Exceptions;
using EmployeeManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly AppDbContext _context;

        public EmployeesController(IEmployeeService employeeService, AppDbContext context)
        {
            _employeeService = employeeService;
            _context = context;
        }

        // GET: api/employees 
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            return Ok(employees);
        }

        // POST: api/employees (Admin creates new employee)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await _employeeService.CreateEmployeeAsync(dto);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.", details = ex.Message });
            }
        }

        // GET: api/employees/me 
        [HttpGet("me")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetOwnProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var profile = await _employeeService.GetOwnProfileAsync(userId);
            return Ok(profile);
        }

        // PUT: api/employees/me (Employee updates own profile)
        [HttpPut("me")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> UpdateOwnProfile(UpdateEmployeeDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _employeeService.UpdateOwnProfileAsync(userId, dto);
            return Ok(new { message = "Profile updated successfully" });
        }

        //  PUT: api/employees/{id} (Admin edits any employee)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEmployee(int id, UpdateEmployeeDto dto)
        {
            try
            {
                // First update the employee details
                await _employeeService.UpdateEmployeeAsync(id, dto);

                // If password reset is requested
                if (dto.ResetPassword)
                {
                    await _employeeService.ResetEmployeePasswordAsync(id);
                }

                return Ok(new { message = "Employee updated successfully" });
            }
            catch (EmployeeNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
             
                return StatusCode(500, new { message = "An error occurred while updating the employee" });
            }
        }

        //  DELETE: api/employees/{id} (Admin deletes employee)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            await _employeeService.DeleteEmployeeAsync(id);
            return Ok(new { message = "Employee deleted successfully" });
        }

        [HttpGet("by-department/{departmentName}")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> GetEmployeesByDepartment(string departmentName)
        {
            var employees = await _employeeService.GetEmployeesByDepartmentAsync(departmentName);
            return Ok(employees);
        }

    }
}