import http.server
import socketserver
import os
import re

PORT = 4321

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def guess_type(self, path):
        p = str(path).lower()
        if p.endswith('.m4a'):
            return 'audio/mp4'
        if p.endswith('.mp3'):
            return 'audio/mpeg'
        if p.endswith('.ogg'):
            return 'audio/ogg'
        if p.endswith('.wav'):
            return 'audio/wav'
        if p.endswith('.json'):
            return 'application/json'
        return super().guess_type(path)

    def send_head(self):
        if 'Range' not in self.headers:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        total_len = fs.st_size

        range_header = self.headers.get('Range', '')
        m = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if not m:
            return super().send_head()

        start = int(m.group(1))
        end = int(m.group(2)) if m.group(2) else total_len - 1

        if start >= total_len or end >= total_len or start > end:
            self.send_error(416, "Requested Range Not Satisfiable")
            self.send_header('Content-Range', f'bytes */{total_len}')
            self.end_headers()
            f.close()
            return None

        self.send_response(206)
        self.send_header('Content-type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {start}-{end}/{total_len}')
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Last-Modified', self.date_time_string(int(fs.st_mtime)))
        self.end_headers()

        f.seek(start)
        return f

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', PORT), RangeHTTPRequestHandler) as httpd:
        print(f"Serving HTTP on 127.0.0.1 port {PORT} with Range and audio/mp4 support...")
        httpd.serve_forever()
