from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import datetime
from fpdf import FPDF
import io
import uuid

app = Flask(__name__)
CORS(app)

# Session cache for the generator page
SESSIONS = {}

# --- PDF Creation Function (This is the correct grid version) ---
def create_timetable_pdf(df, title):
    schedule = {}
    for _, row in df.iterrows():
        key = (row['Day'], row['Start Time'])
        schedule[key] = { "course": row['Course Name'], "faculty": row['Faculty'], "venue": row['Venue'] }
    pdf = FPDF(orientation='L', unit='mm', format='A4')
    pdf.add_page()
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, title, ln=True, align='C')
    pdf.ln(5)
    pdf.set_font('Arial', 'B', 10)
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    col_width = (pdf.w - pdf.l_margin - pdf.r_margin - 30) / len(days)
    time_col_width = 30
    row_height = 18
    pdf.cell(time_col_width, 10, 'Time', border=1, align='C')
    for day in days:
        pdf.cell(col_width, 10, day, border=1, align='C')
    pdf.ln()
    pdf.set_font('Arial', '', 9)
    for hour in range(9, 17):
        if hour == 13: continue
        start_time = f"{hour:02d}:00"
        time_display = f"{start_time} - {hour+1:02d}:00"
        y_pos = pdf.get_y()
        pdf.multi_cell(time_col_width, row_height, time_display, border=1, align='C', new_x="RIGHT", new_y="TOP")
        for day in days:
            key = (day, start_time)
            if key in schedule:
                entry = schedule[key]
                cell_text = f"{entry['course']}\n{entry['faculty']}\n({entry['venue']})"
                pdf.multi_cell(col_width, row_height / 3, cell_text, border=1, align='C', new_x="RIGHT", new_y="TOP")
            else:
                pdf.multi_cell(col_width, row_height, '', border=1, align='C', new_x="RIGHT", new_y="TOP")
        pdf.ln(row_height)
    pdf_buffer = io.BytesIO(pdf.output())
    pdf_buffer.seek(0)
    return pdf_buffer

# --- API ENDPOINTS ---

@app.route('/api/process-excel', methods=['POST'])
def process_excel():
    if 'timetableFile' not in request.files: return jsonify({"error": "No file part in request."}), 400
    file = request.files['timetableFile']
    if file.filename == '': return jsonify({"error": "No file selected."}), 400
    try:
        df = pd.read_excel(file)
        required_columns = ['Course Name', 'Faculty', 'Venue', 'Day', 'Start Time', 'End Time', 'Students']
        missing = [col for col in required_columns if col not in df.columns]
        if missing: return jsonify({"error": f"Missing columns: {', '.join(missing)}"}), 400
        df['Start Time'] = df['Start Time'].apply(lambda x: x.strftime('%H:%M') if hasattr(x, 'strftime') else str(x))
        df['End Time'] = df['End Time'].apply(lambda x: x.strftime('%H:%M') if hasattr(x, 'strftime') else str(x))
        
        session_id = str(uuid.uuid4())
        SESSIONS[session_id] = df
        
        # Return BOTH a session ID (for generator) and the data (for dashboard)
        return jsonify({"status": "success", "session_id": session_id, "data": df.to_dict(orient='records')})
    except Exception as e:
        return jsonify({"error": f"Failed to process file: {str(e)}"}), 500

# Endpoint for the Generator page (uses session ID)
@app.route('/api/download-pdf-session/<session_id>', methods=['GET'])
def download_pdf_session(session_id):
    if session_id not in SESSIONS: return jsonify({"error": "Invalid session ID."}), 404
    df = SESSIONS[session_id]
    timetable_name = request.args.get('name', 'Timetable')
    pdf_buffer = create_timetable_pdf(df, timetable_name)
    return send_file(pdf_buffer, as_attachment=True, download_name=f"{timetable_name}.pdf", mimetype='application/pdf')

# Endpoint for the Dashboard page (receives data directly)
@app.route('/api/download-pdf-data', methods=['POST'])
def download_pdf_data():
    data = request.get_json()
    if not data or 'entries' not in data: return jsonify({"error": "Missing timetable data."}), 400
    df = pd.DataFrame(data['entries'])
    timetable_name = data.get('name', 'Timetable')
    pdf_buffer = create_timetable_pdf(df, timetable_name)
    return send_file(pdf_buffer, as_attachment=True, download_name=f"{timetable_name}.pdf", mimetype='application/pdf')

if __name__ == '__main__':
    app.run(port=5001, debug=True)
