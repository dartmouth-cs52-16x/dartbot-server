import PythonShell from 'python-shell';

export function ddsScraping() {
  const options = {
    args: [process.env.MONGODB_URI, process.env.DATABASE_NAME],
  };
  PythonShell.run('../scraping.py', options, (err, results) => {
    if (err) throw err;
  });
}
