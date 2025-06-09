const KEY = process.env.GEOAPIFY_API_KEY!;
if (!KEY) throw new Error('Missing GEOAPIFY_API_KEY');

type Coords = { lat: number; lon: number };

async function geocode(addr: string): Promise<Coords> {
  const u = new URL('https://api.geoapify.com/v1/geocode/search');
  u.searchParams.set('text', addr);
  u.searchParams.set('apiKey', KEY);
  const res = await fetch(u.toString());
  const j = await res.json();
  if (!j.features?.length) throw new Error(`No coords for "${addr}"`);
  const [lon, lat] = j.features[0].geometry.coordinates;
  return { lat, lon };
}

export async function calculateDistance(
  homeAddress: string,
  officeAddress: string
): Promise<number> {
  try {
    const [home, office] = await Promise.all([
      geocode(homeAddress),
      geocode(officeAddress),
    ]);
    const u = new URL('https://api.geoapify.com/v1/routing');
    u.searchParams.set('waypoints', `${home.lat},${home.lon}|${office.lat},${office.lon}`);
    u.searchParams.set('mode', 'drive');
    u.searchParams.set('apiKey', KEY);
    const res = await fetch(u.toString());
    const j = await res.json();
    if (!j.features?.length) throw new Error('Routing failed');
    return j.features[0].properties.distance / 1000;
  } catch (e) {
    console.warn('Distance API failed, falling back');
    return 0;
  }
}
