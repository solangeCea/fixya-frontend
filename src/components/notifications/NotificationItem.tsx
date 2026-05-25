interface Props {
  title: string;
  message: string;
  time: string;
}

function NotificationItem({
  title,
  message,
  time,
}: Props) {
  return (
    <div className="cursor-pointer border-b border-gray-100 p-4 transition hover:bg-gray-50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-gray-900">
            {title}
          </h4>

          <p className="mt-1 text-sm text-gray-600">
            {message}
          </p>
        </div>

        <span className="whitespace-nowrap text-xs text-gray-400">
          {time}
        </span>
      </div>
    </div>
  );
}

export default NotificationItem;