from flask import Flask, request, jsonify
import flask
from flask_cors import CORS
import json
import glob
import os
import urllib
import requests



app = Flask(__name__)
CORS(app)

'''
{
	filename: "asdf"
	data: [{
			name: "category",
			transactions: [{
					title: bananas
					cost: $4.50
			}]
		  }]
}

'''


@app.route('/model', methods=['GET','POST', 'OPTIONS'])
#@crossdomain(origin='*')
def process_model():

	resp = flask.Response()
	resp.mimetype = 'application/json'
	if request.method == 'POST':
		json_body = request.get_json(force=True)
		filename = json_body['filename']
		data = json_body['data']
		csv_string = write_data_to_csv_string(data)
		if not os.path.exists("budgets"):
			os.makedirs("budgets")
		with open("budgets/"+ filename + ".csv", 'w+') as csv:
			csv.write(csv_string)
			csv.truncate()
		return resp
	else:
		print request

		return resp


def write_data_to_csv_string(data):
	csv_content = "" #"data:text/csv;charset=utf-8"
	#first loop add all category headers and find largest txn array
	longest_txn_len = 0

	for i, category in enumerate(data):
		cat_name = category['name']
		cat_txns = category['transactions']
		cat_len = len(cat_txns)
		csv_content += cat_name + ",Cost" + ("" if i == len(data) - 1 else ",")
		if cat_len > longest_txn_len:
			longest_txn_len = cat_len
	csv_content += "\n"

	#loop over length of largest txn array over all categories, add txns if they exist
	for i in range(longest_txn_len):
		for j, category in enumerate(data):
			transactions = category['transactions']
			if i < len(transactions):
				transaction = category['transactions'][i]
				csv_content += transaction['title'] + "," + str(transaction['cost']) + \
									("" if j == len(data) - 1 else ",")
			else:
				csv_content += ",,"
		csv_content += "\n"
	return csv_content



if __name__ == '__main__':
	app.run(host='127.0.0.1')



