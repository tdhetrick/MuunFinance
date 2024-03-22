from modules.database import db
from modules.model import  ImportConfig, Transaction

class TransactionImporter:
    def __init__(self, file_content,account_id):
        self.file_content = file_content
        self.account_id = account_id
        self.required_fields = ['amount', 'description', 'type', 'date']

    def detect_delimiter(self):      
        first_line = self.file_content.split('\n')[0]
        if ',' in first_line:
            return ','
        elif ';' in first_line:
            return ';'
        elif '\t' in first_line:
            return '\t'
        else:
            return None

    def detect_configuration(self):
        lines = self.file_content.split('\n')
        delimiter = self.detect_delimiter()
        num_columns = len(lines[0].split(delimiter))
        num_rows = len(lines)
        return {
            'delimiter': delimiter,
            'num_columns': num_columns,
            'num_rows': num_rows
        }

    def detect_header(self):
        first_line = self.file_content.replace('\r\n', '\n').split('\n')[0]
        delimiter = self.detect_delimiter()
        headers = first_line.split(delimiter)
        return headers if not any(header.isdigit() for header in headers) else None
    
    def save_configuration(self):
        config = self.detect_configuration()
        headers = self.detect_header()
        import_config = ImportConfig(
            account_id=self.account_id,
            delimiter=config['delimiter'],
            date_format='',  # determine the date format
            column_mapping={header: None for header in headers} if headers else {}
        )
        db.session.add(import_config)
        db.session.commit()

    def has_existing_config(self):
        existing_config = ImportConfig.query.filter_by(account_id=self.account_id).first()
        return existing_config is not None
    
    def import_transactions(self):
        if not self.has_existing_config():
            return 0  # No import configuration found

        import_config = ImportConfig.query.filter_by(account_id=self.account_id).first()
        delimiter = import_config.delimiter

        
        lines = self.file_content
        headers = self.detect_header()
        if headers:
            lines = lines[1:]  # Skip the header line

        successful_transactions = 0  # Initialize the counter

        for line in lines:
            data = line.strip().split(delimiter)
            if self.create_transaction(data, import_config.column_mapping):
                successful_transactions += 1  # Increment the counter

        db.session.commit()

        return successful_transactions


    def create_transaction(self, row, mapping):
        transaction_data = {mapping[i]: value for i, value in enumerate(row)}
        transaction = Transaction(**transaction_data)
        db.session.add(transaction)
        try:
            db.session.commit()
            return True  # Success
        except Exception as e:
            db.session.rollback()
            print(e)
            return False  # Failure  
