CREATE TRIGGER before_hourly_pay_update
BEFORE UPDATE ON Employee
FOR EACH ROW
SET NEW.Salary = (NEW.hourly_pay * 2080);

CREATE TRIGGER before_add_employee
BEFORE INSERT ON Employee
FOR EACH ROW
SET NEW.Salary = (NEW.hourly_pay * 2080);


DELIMITER //

CREATE TRIGGER after_transaction_status_update
BEFORE UPDATE ON InventoryTransactions
FOR EACH ROW
BEGIN
  IF NEW.Status = 'Completed' AND OLD.Status = 'Pending' THEN
    SET NEW.TransactionType = 'Received';
    SET NEW.ReceiveDate = CURRENT_TIMESTAMP;
  END IF;
END;
//