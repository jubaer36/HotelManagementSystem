CREATE TRIGGER before_hourly_pay_update
BEFORE UPDATE ON Employee
FOR EACH ROW
SET NEW.Salary = (NEW.hourly_pay * 2080);

CREATE TRIGGER before_add_employee
BEFORE INSERT ON Employee
FOR EACH ROW
SET NEW.Salary = (NEW.hourly_pay * 2080);