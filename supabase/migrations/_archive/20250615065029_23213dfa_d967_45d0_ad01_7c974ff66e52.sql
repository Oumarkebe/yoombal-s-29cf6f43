
create or replace function get_latest_delivery_locations(p_delivery_ids uuid[])
returns table(delivery_id uuid, latitude numeric, longitude numeric, created_at timestamptz)
language plpgsql
as $$
begin
  return query
      with latest_tracking as (
          select
              dt.delivery_id,
              dt.latitude,
              dt.longitude,
              dt.created_at,
              row_number() over(partition by dt.delivery_id order by dt.created_at desc) as rn
          from public.delivery_tracking dt
          where dt.delivery_id = any(p_delivery_ids)
      )
      select
          lt.delivery_id,
          lt.latitude,
          lt.longitude,
          lt.created_at
      from latest_tracking lt
      where lt.rn = 1;
end;
$$;
