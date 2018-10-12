import re, requests, json, lxml.html
from collections import defaultdict

__path__ = []

class Segment:
	def __init__(self, tag, value, pageno):
		self.tag = tag
		self.pageno = pageno
		self.value = value.replace('\n', ' ') if value is not None else None

	def is_text(self):
		return False

	def is_br(self):
		return False

class TextSegment(Segment):
	def __init__(self, value, pageno):
		super().__init__('_t', value, pageno)

	def is_text(self):
		return True

	def merge_with(self, seg):
		return TextSegment(self.value + ' ' + seg.value, self.pageno)

	def less_whitespace(self):
		value = re.sub(r' {2,}', ' ', self.value)
		return TextSegment(value, self.pageno)

class BrSegment(Segment):
	def __init__(self, pageno):
		super().__init__('_br', None, pageno)

	def is_br(self):
		return True

	def to_space(self):
		return TextSegment(' ', self.pageno)

class SegmentQueue:
	def __init__(self):
		self.queue = []

	def add(self, elem, pageno):
		if isinstance(elem, lxml.html.HtmlComment):
			tail = elem.tail
			if tail:
				self.queue.append(TextSegment(tail, pageno))
			return

		tag = elem.tag
		if tag == 'br':
			self.queue.append(BrSegment(pageno))
		else:
			self.queue.append(Segment(tag, elem.text, pageno))

		tail = elem.tail
		if tail is not None:
			stripped = tail.strip()
			if len(stripped) > 0:
				seg = TextSegment(tail, pageno)
				self.queue.append(seg)

	def __iter__(self):
		yield from self.queue

def merge_chunk(chunk):
	res = []
	for seg in chunk:
		if len(res) > 0:
			last = res[-1]
			if last.is_text() and seg.is_text():
				res[-1] = last.merge_with(seg)
				continue
		res.append(seg)
	return res

def adjust_text_segs(chunk):
	def adjust(seg):
		if seg.is_text():
			return seg.less_whitespace()
		return seg
	return [adjust(seg) for seg in chunk]

def process_queue(queue):
	res = [[]]
	was_br = False
	was_multi_br = False
	had_b = False

	for seg in queue:
		if seg.is_br():
			if was_br:
				was_multi_br = True
			else:
				was_br = True
			res[-1].append(seg.to_space())
		else:
			if was_multi_br:
				res.append([])
				had_b = False
			elif seg.tag == 'b' and not had_b:
				res.append([])
				had_b = True

			res[-1].append(seg)
			was_multi_br = False
			was_br = False

	return [adjust_text_segs(merge_chunk(chunk)) for chunk in res]

def scan_page(pageno, queue):
	path = 'html/{:04}.html'.format(pageno)
	with open(path, 'r') as f:
		doc = lxml.html.fromstring(f.read())

	proof = doc.xpath('//p[contains(text(), "This page has been proofread")]')[0]
	the_p = proof.getnext()

	for child in the_p.getchildren():
		queue.add(child, pageno)

def build_index():
	queue = SegmentQueue()
	for pageno in range(89, 1337):
		scan_page(pageno, queue)

	index = defaultdict(list)

	for chunk in process_queue(queue):
		b_tags = (sub for sub in chunk if sub.tag == 'b')
		entry_seg = next(b_tags, None)
		if entry_seg is None:
			continue

		elems = []
		entry = entry_seg.value.strip(',')
		pageno = entry_seg.pageno
		index[entry].append([pageno, elems])
		for elem in chunk:
			elems.append((elem.tag, elem.value))

	print(json.dumps(index))

if __name__ == '__main__':
	build_index()
