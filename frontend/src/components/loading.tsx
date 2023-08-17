import { useIsFetching } from "@tanstack/react-query";

export default function Loader() {
  const isFetching = useIsFetching()
  if (!isFetching) return null

  return <>Fetching...</>
}