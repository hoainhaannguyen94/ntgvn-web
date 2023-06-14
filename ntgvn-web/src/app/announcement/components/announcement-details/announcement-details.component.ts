import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AnnouncementFacadeService } from '../../facade/announcement-facade.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BaseComponent } from '@utils/base/base.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { take, takeUntil, timer } from 'rxjs'
import { IAnnouncement } from '@utils/schema';
declare const CKEDITOR;

@Component({
    selector: 'announcement-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        ErrorMessageComponent
    ],
    templateUrl: './announcement-details.component.html',
    styleUrls: ['./announcement-details.component.scss']
})
export class AnnouncementDetailsComponent extends BaseComponent implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    matSnackbar = inject(MatSnackBar);
    router = inject(Router);
    announcementFacade = inject(AnnouncementFacadeService);

    @ViewChild('editor') editorElement: ElementRef<HTMLElement>;

    announcementId = '';
    announcement: IAnnouncement;

    titleFormControl = new FormControl('', [Validators.required]);

    editor;
    editorData = '';

    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.announcementId = value['id']
                this.announcementFacade.loadAnnouncement(this.announcementId);
            }
        });
    }

    renderEditor() {
        const editorRead$ = timer(0, 100).subscribe({
            next: () => {
                if (this.editorElement) {
                    editorRead$.unsubscribe();
                    CKEDITOR.ClassicEditor.create(this.editorElement.nativeElement, {
                        // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
                        toolbar: {
                            items: [
                                'exportPDF', 'exportWord', '|',
                                'findAndReplace', 'selectAll', '|',
                                'heading', '|',
                                'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                                'bulletedList', 'numberedList', 'todoList', '|',
                                'outdent', 'indent', '|',
                                'undo', 'redo',
                                '-',
                                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                                'alignment', '|',
                                'link', 'insertImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
                                'specialCharacters', 'horizontalLine', 'pageBreak', '|',
                                // 'textPartLanguage', '|',
                                'sourceEditing'
                            ],
                            shouldNotGroupWhenFull: true
                        },
                        // Changing the language of the interface requires loading the language file using the <script> tag.
                        // language: 'es',
                        list: {
                            properties: {
                                styles: true,
                                startIndex: true,
                                reversed: true
                            }
                        },
                        // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
                        heading: {
                            options: [
                                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                            ]
                        },
                        // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
                        placeholder: '',
                        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
                        fontFamily: {
                            options: [
                                'default',
                                'Arial, Helvetica, sans-serif',
                                'Courier New, Courier, monospace',
                                'Georgia, serif',
                                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                                'Tahoma, Geneva, sans-serif',
                                'Times New Roman, Times, serif',
                                'Trebuchet MS, Helvetica, sans-serif',
                                'Verdana, Geneva, sans-serif'
                            ],
                            supportAllValues: true
                        },
                        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
                        fontSize: {
                            options: [10, 12, 14, 'default', 18, 20, 22],
                            supportAllValues: true
                        },
                        // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
                        // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
                        htmlSupport: {
                            allow: [
                                {
                                    name: /.*/,
                                    attributes: true,
                                    classes: true,
                                    styles: true
                                }
                            ]
                        },
                        // Be careful with enabling previews
                        // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
                        htmlEmbed: {
                            showPreviews: true
                        },
                        // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
                        link: {
                            decorators: {
                                addTargetToExternalLinks: true,
                                defaultProtocol: 'https://',
                                toggleDownloadable: {
                                    mode: 'manual',
                                    label: 'Downloadable',
                                    attributes: {
                                        download: 'file'
                                    }
                                }
                            }
                        },
                        // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
                        mention: {
                            feeds: [
                                {
                                    marker: '@',
                                    feed: [
                                        '@all', '@nhan', '@long', '@tuananh'
                                    ],
                                    minimumCharacters: 1
                                }
                            ]
                        },
                        // The "super-build" contains more premium features that require additional configuration, disable them below.
                        // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
                        removePlugins: [
                            // These two are commercial, but you can try them out without registering to a trial.
                            // 'ExportPdf',
                            // 'ExportWord',
                            'CKBox',
                            'CKFinder',
                            'EasyImage',
                            // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
                            // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
                            // Storing images as Base64 is usually a very bad idea.
                            // Replace it on production website with other solutions:
                            // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
                            // 'Base64UploadAdapter',
                            'RealTimeCollaborativeComments',
                            'RealTimeCollaborativeTrackChanges',
                            'RealTimeCollaborativeRevisionHistory',
                            'PresenceList',
                            'Comments',
                            'TrackChanges',
                            'TrackChangesData',
                            'RevisionHistory',
                            'Pagination',
                            'WProofreader',
                            // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
                            // from a local file system (file://) - load this site via HTTP server if you enable MathType.
                            'MathType',
                            // The following features are part of the Productivity Pack and require additional license.
                            'SlashCommand',
                            'Template',
                            'DocumentOutline',
                            'FormatPainter',
                            'TableOfContents'
                        ]
                    }).then(editorInstance => {
                        this.editor = editorInstance;
                        this.editor.setData(this.announcement.body);
                        this.editor.model.document.on('change:data', () => {
                            this.editorData = this.editor.getData()
                        });
                    });
                }
            }
        });
    }

    override registerCoreLayer() {
        this.announcementFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.announcementFacade.getAnnouncement$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.announcement = value;
                this.titleFormControl.setValue(this.announcement.title);
                this.editorData = this.announcement.body;
                this.renderEditor();
            },
            error: err => {
                throw err;
            }
        });
    }

    cancelHandler() {
        this.router.navigate(['/announcement/list']);
    }

    updateHandler() {
        this.announcementFacade.updateAnnouncement$(this.announcementId, {
            title: this.titleFormControl.value,
            body: this.editorData,
            createdBy: this.announcement.createdBy,
            createdAt: this.announcement.createdAt,
            lastUpdatedBy: this.appState.me._id,
            lastUpdatedAt: new Date().toISOString()
        }).subscribe({
            next: () => {
                this.matSnackbar.open(`Announcement have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/announcement/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
