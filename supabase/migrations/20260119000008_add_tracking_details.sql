-- Add speed and heading columns to delivery_tracking table
ALTER TABLE delivery_tracking
ADD COLUMN speed float, -- Speed in m/s
ADD COLUMN heading float; -- Heading in degrees (0-360)
