import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

export class DocxTemplateProcessorHospital {
  
  // Main function to generate and download referral document
  static async downloadReferralDocument(patientName, section) {
    try {
      console.log('Starting document generation for:', patientName);
      
      // 1. Fetch the template DOCX file
      const response = await fetch('/templates/forwardToHospital.docx');
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('Template loaded, size:', arrayBuffer.byteLength);
      
      // 2. Initialize PizZip with the document
      const zip = new PizZip(arrayBuffer);
      
      // 3. Initialize and configure docxtemplater
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: this.createCustomParser(),
        delimiters: {
          start: '{{',
          end: '}}'
        }
      });
      
      // 4. Prepare the data for replacement
      const data = {
        patientName: patientName,
        section: section,
        date: new Date().toLocaleDateString('ar-EG'),
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        time: new Date().toLocaleTimeString('ar-EG')
      };
      
      console.log('Setting template data:', data);
      
      // 5. Set the data and render
      doc.setData(data);
      
      try {
        doc.render();
        console.log('Document rendered successfully');
      } catch (renderError) {
        console.error('Template rendering error:', renderError);
        console.error('Error properties:', renderError.properties);
        throw new Error(`Template error: ${renderError.message}`);
      }
      
      // 6. Generate the output as blob
      const outBlob = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        compression: 'DEFLATE'
      });
      
      // 7. Create filename
      const fileName = `تحويل_${patientName.replace(/\s+/g, '_')}_${Date.now()}.docx`;
      
      // 8. Download immediately (NO HTML PREVIEW)
      const url = URL.createObjectURL(outBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 9. Clean up URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Document downloaded:', fileName);
      
      return fileName;
      
    } catch (error) {
      console.error('Error in generateReferralDocument:', error);
      throw error;
    }
  }
  
  // Helper function to create custom parser for Arabic text
  static createCustomParser() {
    return (tag) => ({
      get(scope) {
        if (tag === '.') {
          return scope;
        }
        
        // Handle nested properties
        const parts = tag.split('.');
        let current = scope;
        
        for (const part of parts) {
          if (current && current[part] !== undefined) {
            current = current[part];
          } else {
            return '';
          }
        }
        
        return current;
      }
    });
  }
}