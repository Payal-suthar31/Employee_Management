using Employee_project.Entity;
using EmployeeManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Department> Departments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FullName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasIndex(e => e.Email)
                    .IsUnique();

                entity.Property(e => e.Password)
                    .IsRequired();

                entity.Property(e => e.Department)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Position)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            builder.Entity<Report>(entity =>
            {
                entity.HasKey(r => r.ReportId);

                entity.HasOne(r => r.Employee)
                      .WithMany(e => e.Reports)  
                      .HasForeignKey(r => r.EmployeeId)
                      .OnDelete(DeleteBehavior.Cascade);  
            });




            builder.Entity<Department>().HasData(
               
                new Department { Id = 1, Name = "HR" },
                new Department { Id = 2, Name = "IT" },
                new Department { Id = 3, Name = "Finance" },
                new Department { Id = 4, Name = "Sales" },
                new Department { Id = 5, Name = "Marketing" },
                new Department { Id = 6, Name = "Operations" },
                new Department { Id = 7, Name = "Customer Support" },
                new Department { Id = 8, Name = "Admin" },
                new Department { Id = 9, Name = "R&D" },
                new Department { Id = 10, Name = "Procurement" },
                new Department { Id = 11, Name = "Legal" }

            );
        }
    }
}
