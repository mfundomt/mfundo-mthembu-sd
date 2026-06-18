import { Component, inject, OnInit, input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { marked } from 'marked';
import { NgwWindowControllerService } from 'ngx-windows';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="file-viewer">
      @if (loading()) {
        <div class="fv-loading">
          <span class="fv-spinner">⟳</span>
          <span>Loading...</span>
        </div>
      } @else if (htmlContent()) {
        <div class="fv-body" [innerHTML]="htmlContent()"></div>
      } @else {
        <div class="fv-error">Could not load content.</div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: #1a1a2e;
    }

    .file-viewer {
      width: 100%;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }

    .fv-body {
      padding: 18px 22px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      color: #e0e0e0;
      line-height: 1.7;

      ::ng-deep {
        h1, h2 {
          color: #5af78e;
          border-bottom: 1px solid #333;
          padding-bottom: 4px;
          margin: 0 0 12px;
        }
        h3 { color: #7eb8f7; margin: 10px 0 6px; }
        p  { margin: 0 0 10px; }
        ul { padding-left: 20px; margin: 0 0 10px; }
        li { margin-bottom: 4px; }
        strong { color: #fff; }
        a { color: #7eb8f7; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code {
          background: #2a2a3e;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          color: #f78e5a;
        }
        pre {
          background: #111;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 12px;
          overflow-x: auto;
        }
        img { max-width: 100%; border-radius: 6px; }
      }
    }

    .fv-loading {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 24px;
      color: #aaa;
      font-family: monospace;
    }

    .fv-spinner {
      animation: spin 1s linear infinite;
      display: inline-block;
      font-size: 20px;
      color: #5af78e;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .fv-error {
      padding: 24px;
      color: #ff5f57;
      font-family: monospace;
    }
  `]
})
export class FileViewerComponent implements OnInit {
  windowController = input.required<NgwWindowControllerService>();

  private http = inject(HttpClient);
  loading = signal(true);
  htmlContent = signal('');

  ngOnInit() {
    const data = this.windowController().data() as { section: string };
    if (!data?.section) { this.loading.set(false); return; }

    this.http.get(`assets/command-info/${data.section}.md`, { responseType: 'text' }).subscribe({
      next: (raw) => {
        const content = this.stripFrontmatter(raw);
        this.htmlContent.set(marked.parse(content) as string);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private stripFrontmatter(raw: string): string {
    if (!raw.startsWith('---')) return raw;
    const end = raw.indexOf('---', 3);
    return end === -1 ? raw : raw.slice(end + 3).trim();
  }
}
