\c biztime

-- Drop existing tables if they exist
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;

-- Create companies table
CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

-- Create industries table
CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL,
    company_code text REFERENCES companies(code)
);

-- Create invoices table
CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

-- Insert sample data into companies
INSERT INTO companies VALUES 
    ('apple', 'Apple Computer', 'Maker of OSX.'),
    ('ibm', 'IBM', 'Big blue.');

-- Insert sample data into industries
INSERT INTO industries (code, industry, company_code) VALUES 
    ('tech', 'Technology', 'apple'),
    ('fin', 'Finance', 'ibm'),
    ('tech', 'Technology', 'ibm');  
    
-- Insert sample data into invoices
INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES 
    ('apple', 100, false, NULL),
    ('apple', 200, false, NULL),
    ('apple', 300, true, '2018-01-01'),
    ('ibm', 400, false, NULL);
