export default function TileEditor({ icn }: { icn: JSX.Element }) {
  return (
    <div className='inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg cursor-pointer p-4 '
      style={{ backgroundImage: 'linear-gradient(-33deg, #DAFEFD 5%, #FDFDB3 50%, #FCDAAB)' }} >
      {icn}
    </div>
  );
}