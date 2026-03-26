export default async function globalTearDown() {
  await global._MONGOINSTANCE.stop()
}
